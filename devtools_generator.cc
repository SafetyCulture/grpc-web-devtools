// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

#include <google/protobuf/compiler/code_generator.h>
#include <google/protobuf/compiler/plugin.h>
#include <google/protobuf/descriptor.h>
#include <google/protobuf/io/printer.h>
#include <google/protobuf/io/zero_copy_stream.h>
#include <string>
#include <iostream>

using google::protobuf::compiler::CodeGenerator;
using google::protobuf::compiler::GeneratorContext;
using google::protobuf::compiler::ParseGeneratorParameter;
using google::protobuf::io::Printer;
using google::protobuf::io::ZeroCopyOutputStream;
using google::protobuf::FileDescriptor;

namespace grpc {
namespace web {
namespace devtools {
namespace {

using std::string;

// The following 5 functions were copied from
// google/protobuf/src/google/protobuf/stubs/strutil.h

inline bool HasPrefixString(const string& str,
                            const string& prefix) {
  return str.size() >= prefix.size() &&
      str.compare(0, prefix.size(), prefix) == 0;
}

inline string StripPrefixString(const string& str, const string& prefix) {
  if (HasPrefixString(str, prefix)) {
    return str.substr(prefix.size());
  } else {
    return str;
  }
}

inline bool HasSuffixString(const string& str,
                            const string& suffix) {
  return str.size() >= suffix.size() &&
      str.compare(str.size() - suffix.size(), suffix.size(), suffix) == 0;
}

inline string StripSuffixString(const string& str, const string& suffix) {
  if (HasSuffixString(str, suffix)) {
    return str.substr(0, str.size() - suffix.size());
  } else {
    return str;
  }
}

void ReplaceCharacters(string *s, const char *remove, char replacewith) {
  const char *str_start = s->c_str();
  const char *str = str_start;
  for (str = strpbrk(str, remove);
       str != nullptr;
       str = strpbrk(str + 1, remove)) {
    (*s)[str - str_start] = replacewith;
  }
}

// The following function was copied from
// google/protobuf/src/google/protobuf/compiler/cpp/cpp_helpers.cc

string StripProto(const string& filename) {
  if (HasSuffixString(filename, ".protodevel")) {
    return StripSuffixString(filename, ".protodevel");
  } else {
    return StripSuffixString(filename, ".proto");
  }
}

class Generator : public CodeGenerator {
  public:
  Generator() {}
  ~Generator() override {}

  bool Generate(const FileDescriptor* file, const string& parameter, GeneratorContext* context, string* error) const override {
    std::vector<std::pair<string, string> > options;
    ParseGeneratorParameter(parameter, &options);
    
    string file_name;

    for (size_t i = 0; i < options.size(); ++i) {
      if (options[i].first == "out") {
        file_name = options[i].second;
      } else {
        *error = "unsupported options: " + options[i].first;
        return false;
      }
    }

    if (file_name.empty()) {
      file_name = StripProto(file->name()) + "_grpc_web_devtools_pb.js";
    }

    if (!file->service_count()) {
      // No services, nothing to do.
      return true;
    }

    std::unique_ptr<ZeroCopyOutputStream> output(context->Open(file_name));
    Printer printer(output.get(), '$');

    

    return false;
  }

};


} // namespace
} // namespace devtools
} // namespace web
} // namespace grpc

int main(int argc, char* argv[]) {

   grpc::web::devtools::Generator generator;

  std::cout << "dev tools";
  return 0;
}