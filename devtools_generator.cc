// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

#include <google/protobuf/compiler/code_generator.h>
#include <google/protobuf/compiler/plugin.h>
#include <google/protobuf/descriptor.h>
#include <google/protobuf/io/printer.h>
#include <google/protobuf/io/zero_copy_stream.h>
#include <string>
#include <iostream>

using google::protobuf::Descriptor;
using google::protobuf::FileDescriptor;
using google::protobuf::MethodDescriptor;
using google::protobuf::ServiceDescriptor;
using google::protobuf::compiler::CodeGenerator;
using google::protobuf::compiler::GeneratorContext;
using google::protobuf::compiler::ParseGeneratorParameter;
using google::protobuf::compiler::PluginMain;
using google::protobuf::io::Printer;
using google::protobuf::io::ZeroCopyOutputStream;

namespace grpc
{
namespace web
{
namespace devtools
{
namespace
{

using std::string;

// The following 5 functions were copied from
// google/protobuf/src/google/protobuf/stubs/strutil.h

inline bool HasPrefixString(const string &str,
                            const string &prefix)
{
  return str.size() >= prefix.size() &&
         str.compare(0, prefix.size(), prefix) == 0;
}

inline string StripPrefixString(const string &str, const string &prefix)
{
  if (HasPrefixString(str, prefix))
  {
    return str.substr(prefix.size());
  }
  else
  {
    return str;
  }
}

inline bool HasSuffixString(const string &str,
                            const string &suffix)
{
  return str.size() >= suffix.size() &&
         str.compare(str.size() - suffix.size(), suffix.size(), suffix) == 0;
}

inline string StripSuffixString(const string &str, const string &suffix)
{
  if (HasSuffixString(str, suffix))
  {
    return str.substr(0, str.size() - suffix.size());
  }
  else
  {
    return str;
  }
}

void ReplaceCharacters(string *s, const char *remove, char replacewith)
{
  const char *str_start = s->c_str();
  const char *str = str_start;
  for (str = strpbrk(str, remove);
       str != nullptr;
       str = strpbrk(str + 1, remove))
  {
    (*s)[str - str_start] = replacewith;
  }
}

// The following function was copied from
// google/protobuf/src/google/protobuf/compiler/cpp/cpp_helpers.cc

string StripProto(const string &filename)
{
  if (HasSuffixString(filename, ".protodevel"))
  {
    return StripSuffixString(filename, ".protodevel");
  }
  else
  {
    return StripSuffixString(filename, ".proto");
  }
}

string ModuleAlias(const string &filename)
{
  string basename = StripProto(filename);
  ReplaceCharacters(&basename, "-", '$');
  ReplaceCharacters(&basename, "/", '_');
  ReplaceCharacters(&basename, ".", '_');
  return basename + "_pb";
}

string GetRootPath(const string &from_filename, const string &to_filename)
{
  if (HasPrefixString(to_filename, "google/protobuf"))
  {
    return "google-protobuf/";
  }

  size_t slashes = std::count(from_filename.begin(), from_filename.end(), '/');
  if (slashes == 0)
  {
    return "./";
  }
  string result = "";
  for (size_t i = 0; i < slashes; i++)
  {
    result += "../";
  }
  return result;
}

string GetBasename(string filename)
{
  size_t last_slash = filename.find_last_of('/');
  if (last_slash != string::npos)
  {
    return filename.substr(last_slash + 1);
  }
  return filename;
}

string LowercaseFirstLetter(string s)
{
  if (s.empty())
  {
    return s;
  }
  s[0] = ::tolower(s[0]);
  return s;
}

void PrintFileHeader(Printer *printer, const std::map<string, string> &vars)
{
  printer->Print(
      vars,
      "/**\n"
      " * gRPC-Web Dev Tools service mapping generated for $package$\n"
      " */\n\n"
      "// GENERATED CODE -- DO NOT EDIT!\n\n\n");
}

void PrintCommonJsMessagesDeps(Printer *printer, const FileDescriptor *file)
{
  std::map<string, string> vars;

  for (int i = 0; i < file->dependency_count(); i++)
  {
    const string &name = file->dependency(i)->name();
    vars["alias"] = ModuleAlias(name);
    vars["dep_filename"] = GetRootPath(file->name(), name) + StripProto(name);
    // we need to give each cross-file import an alias
    printer->Print(
        vars,
        "\nvar $alias$ = require('$dep_filename$_pb.js')\n");
  }

  string package = file->package();
  vars["package_name"] = package;

  if (!package.empty())
  {
    size_t offset = 0;
    size_t dotIndex = package.find('.');

    printer->Print(vars, "const proto = {};\n");

    while (dotIndex != string::npos)
    {
      vars["current_package_ns"] = package.substr(0, dotIndex);
      printer->Print(vars, "proto.$current_package_ns$ = {};\n");

      offset = dotIndex + 1;
      dotIndex = package.find(".", offset);
    }
  }

  vars["filename"] = GetBasename(StripProto(file->name()));

  if (!package.empty())
  {
    printer->Print(
        vars,
        "proto.$package_name$ = require('./$filename$_pb.js');\n\n");
  }
  else
  {
    printer->Print(
        vars,
        "const proto = require('./$filename$_pb.js');\n\n");
  }
}

string GetNestedMessageName(const Descriptor *descriptor)
{
  if (descriptor == nullptr)
  {
    return "";
  }
  string result = StripPrefixString(descriptor->full_name(),
                                    descriptor->file()->package());
  // Add a leading dot if one is not already present.
  if (!result.empty() && result[0] != '.')
  {
    result = "." + result;
  }
  return result;
}

class Generator : public CodeGenerator
{
public:
  Generator() {}
  ~Generator() override {}

  bool Generate(const FileDescriptor *file, const string &parameter, GeneratorContext *context, string *error) const override
  {
    std::vector<std::pair<string, string>> options;
    ParseGeneratorParameter(parameter, &options);

    string file_name;

    for (size_t i = 0; i < options.size(); ++i)
    {
      if (options[i].first == "out")
      {
        file_name = options[i].second;
      }
      else
      {
        *error = "unsupported options: " + options[i].first;
        return false;
      }
    }

    if (file_name.empty())
    {
      file_name = StripProto(file->name()) + "_grpc_web_devtools_pb.js";
    }

    if (!file->service_count())
    {
      // No services, nothing to do.
      return true;
    }

    std::map<string, string> vars;
    string package = file->package();
    vars["package"] = package;
    vars["package_dot"] = package.empty() ? "" : package + '.';

    std::unique_ptr<ZeroCopyOutputStream> output(context->Open(file_name));
    Printer printer(output.get(), '$');

    PrintFileHeader(&printer, vars);
    PrintCommonJsMessagesDeps(&printer, file);

    printer.Print(vars, "var window = typeof window === 'undefined' ? {} : window;\n");
    printer.Print(vars, "window.__GRPCWEB_DEVTOOLS__ = window.__GRPCWEB_DEVTOOLS__ || { services: {} };\n\n");

    for (int service_index = 0; service_index < file->service_count(); ++service_index)
    {
      const ServiceDescriptor *service = file->service(service_index);
      vars["service_name"] = service->name();

      for (int method_index = 0; method_index < service->method_count(); ++method_index)
      {
        const MethodDescriptor *method = service->method(method_index);
        vars["js_method_name"] = LowercaseFirstLetter(method->name());
        vars["method_name"] = method->name();
        if (method->input_type()->file() != file)
        {
          vars["input_type"] = ModuleAlias(method->input_type()->file()->name()) + GetNestedMessageName(method->input_type());
        }
        else
        {
          vars["input_type"] = "proto." + method->input_type()->full_name();
        }

        if (method->output_type()->file() != file)
        {
          vars["output_type"] = ModuleAlias(method->output_type()->file()->name()) + GetNestedMessageName(method->output_type());
        }
        else
        {
          vars["output_type"] = "proto." + method->output_type()->full_name();
        }

        printer.Print(vars, "window.__GRPCWEB_DEVTOOLS__.services['/$package_dot$$service_name$/$method_name$'] = {\n");
        printer.Indent();
        printer.Print(vars, "requestDeserializeFn: $input_type$.deserializeBinary,\n");
        printer.Print(vars, "responseDeserializeFn: $output_type$.deserializeBinary\n");
        printer.Outdent();
        printer.Print(vars, "};\n\n");
      }
    }

    return true;
  }
};

} // namespace
} // namespace devtools
} // namespace web
} // namespace grpc

int main(int argc, char *argv[])
{
  grpc::web::devtools::Generator generator;
  PluginMain(argc, argv, &generator);
  return 0;
}