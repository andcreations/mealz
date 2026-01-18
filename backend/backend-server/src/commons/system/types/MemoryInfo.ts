export interface MemoryInfo {
  // Resident Set Size.
  // The total memory allocated to your process, including heap and other areas.
  rss: number;
  
  // The total memory allocated for the heap.
  heapTotal: number;

  // The memory currently in use within the heap.
  heapUsed: number;

  // Memory used by external resources like bindings to C++ libraries.
  external: number;

  // Memory allocated to various Buffer-like objects.
  arrayBuffers: number;
}