import * as protobufjs from 'protobufjs';
import { InternalError } from '../errors';

export function loadProtobuf(
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
    throw new InternalError(`Type ${fullTypeName} not found in ${filename}`);
  }

  return type;
}