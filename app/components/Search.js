import { useState } from "react";

export const useSearchText = () => {
  const [searchText, setSearchText] = useState('test');
  return { searchText, setSearchText };
};