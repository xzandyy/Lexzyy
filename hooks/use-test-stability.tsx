import { useRef } from "react";

export default function useTestStability<T>(value: T, name: string) {
  const prevRef = useRef<T>(value);
  const isSame = Object.is(prevRef.current, value);
  console.log(name, "has changed", !isSame);
  prevRef.current = value;
}
