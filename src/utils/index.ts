
export const truncateString = (
  value: string | number | string[] | null | undefined,
  options: { lenght?: number; delimiter?: string } = {}
) => {
  if (!value) return '';
  if (typeof value == 'number') return String(value);
  const opts = { ...{ lenght: 20, delimiter: ', ' }, ...options } as { lenght: number; delimiter: string };
  if (value.length > opts.lenght && typeof value === 'string') {
    return value.substring(0, opts.lenght) + ' ...';
  } else if (typeof value === 'object') {
    const v = value.join(opts.delimiter);
    if (v.length > opts.lenght) {
      return v.substring(0, opts.lenght) + ' ...';
    } else {
      return v.substring(0, opts.lenght);
    }
  }
  const v = JSON.stringify(value).slice(1, -1);
  if (v.length > opts.lenght) {
    return v.substring(0, opts.lenght) + ' ...';
  } else {
    return v.substring(0, opts.lenght);
  }
};



export function capitalizeFirstLetter(inputString: string): string {
  // Check if the string is not empty
  if (inputString.length > 0) {
    // Capitalize the first letter and concatenate the rest of the string
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  } else {
    // Return an empty string if the input is empty
    return '';
  }
}

export const createPopup = (screenX: number, screenY: number, width: number, height: number) => {
  const features = [
    `left=${screenX}`,
    `top=${screenY}`,
    `width=${width}`,
    `height=${height}`,
    `menubar=no`,
    `toolbar=no`,
    `location=no`,
    `status=no`,
    `resizable=yes`,
    `scrollbars=no`,
    `popup`,
  ].join(',');
  // TODO(crbug.com/1153004): The onPopupClose beforeunload works with about:blank popups...
  // return window.open("about:blank", Math.random().toString(), features);
  return window.open('', Math.random().toString(), features);
};
