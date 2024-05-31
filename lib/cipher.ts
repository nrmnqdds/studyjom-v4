const cipher = (salt: string) => {
  const textToChars = (text: string) =>
    text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n: any) => `0${Number(n).toString(16)}`.slice(-2);
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text: string) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};

const decipher = (salt: string) => {
  const textToChars = (text: string) =>
    text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded: any) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex: any) => Number.parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode: any) => String.fromCharCode(charCode))
      .join("");
};

export { cipher, decipher };
