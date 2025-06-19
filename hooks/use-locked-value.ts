import { useRef } from "react";

export default function useLockedValue<T, S>(value: T, status: S, lockStatus: S) {
  const lockedRef = useRef(value);

  if (status !== lockStatus) {
    lockedRef.current = value;
  }

  return lockedRef.current;
}
