import * as protobufjs from 'protobufjs';
import { InternalError } from '../errors';

export function loadProtobufFromFile(
  filename: string,
  packageName: string | undefined,
  typeName: string,
): protobufjs.Type {
// load
  const loader = new protobufjs.Root();
  loader.loadSync(filename, {
    keepCase: true,
  });

// lookup
  const fullTypeName = packageName ? `${packageName}.${typeName}` : typeName;
  const type = loader.lookupType(fullTypeName);
  if (!type) {
    throw new InternalError(
      `Protobuf type ${fullTypeName} not found in ${filename}`,
    );
  }

  return type;
}

export function loadProtobufFromSource(
  source: string,
  packageName: string | undefined,
  typeName: string,
): protobufjs.Type {
// parse
  const parsed = protobufjs.parse(source, {
    keepCase: true,
  });
  const root = parsed.root;

// lookup
  const fullTypeName = packageName ? `${packageName}.${typeName}` : typeName;
  const type = root.lookupType(fullTypeName);
  if (!type) {
    throw new InternalError(`Protobuf type ${fullTypeName} not found`);
  }

  return type;
}