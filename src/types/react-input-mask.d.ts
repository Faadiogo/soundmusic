
declare module 'react-input-mask' {
  import { ComponentType, InputHTMLAttributes } from 'react';

  export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
    alwaysShowMask?: boolean;
    beforeMaskedValueChange?: (newState: any, oldState: any, userInput: string) => any;
  }

  const InputMask: ComponentType<InputMaskProps>;
  export default InputMask;
}
