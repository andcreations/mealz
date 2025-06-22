export const ifEnterKey = (func: () => void) => {
  return (event: any) => {
    if (event.key == 'Enter') {
      func();
    }
  };
}