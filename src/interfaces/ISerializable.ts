export interface ISerializable<T> {
  /**
   * Function to serialize the object.
   */
  serialize(): string;

  /**
   * Function to deserialize the object.
   * @param serialized the serialized string to parse.
   */
  deserialize(serialized: string): T;
}
