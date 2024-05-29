import { useSearchParams } from 'next/navigation';
import React from 'react'

type SearchParamsProps= {
  pageSize:number;
  currentPage:number;
  deleted:boolean;
}
const modifyParams = (PageSizeValue:string,currentValue:string,deletedValue:string,searchParam:string) => {
  const params = new URLSearchParams(searchParam)
      params.set("pageSize",PageSizeValue);
      params.set("current",currentValue);
      params.set("deleted",deletedValue);
      return params.toString()
}

export default modifyParams
