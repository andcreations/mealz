export const ifEnterKey = (func: () => void) => {
  return (event: any) => {
    if (event.key == 'Enter') {
      func();
    }
  };
}

export const stopBubble = (event: React.BaseSyntheticEvent) => {
  event.stopPropagation();
  event.preventDefault();
}