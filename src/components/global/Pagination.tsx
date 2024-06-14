import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import page from "@/app/dashboard/page";

type Prop = {
  changeIndicePagina: (indice: number) => void;
  indicesPagina: number;
  indiceActual: number;
  href?: string;
  createPageURL?: (page: number) => string;
};

export default function Pagination({
  changeIndicePagina,
  indiceActual,
  indicesPagina,
  href,
  createPageURL,
}: Prop) {
  const totalIndices = indicesPagina;
  const current = indiceActual;
  const delta = 3; // Number of pages around the current page to show
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(totalIndices - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift("...");
  }
  if (current + delta < totalIndices - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (totalIndices > 1) {
    range.push(totalIndices);
  }

  return (
    <div className="flex justify-between items-center mt-2">
      <div className="gap-2 flex">
        <button
          onClick={() => changeIndicePagina(0)}
          disabled={current === 0}
          className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {createPageURL && current !== 0 ? (
            <Link href={createPageURL(1)}>
              <ChevronDoubleLeftIcon />
            </Link>
          ) : (
            <ChevronDoubleLeftIcon />
          )}
        </button>
        <button
          onClick={() => changeIndicePagina(current - 1)}
          disabled={current === 0}
          className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {createPageURL && current !== 0 ? (
            <Link href={createPageURL(current)}>
              <ChevronLeftIcon />
            </Link>
          ) : (
            <ChevronLeftIcon />
          )}
        </button>
      </div>
      <div className="gap-2 flex">
        {range.map((page, index) =>
          createPageURL && typeof page === "number" ? (
            <Link key={index} href={createPageURL(page)}>
              <button
                onClick={async () => {
                  if (typeof page === "number") changeIndicePagina(page - 1);
                }}
                className={
                  (typeof page === "number" && page - 1 === current
                    ? "opacity-50 cursor-not-allowed "
                    : typeof page === "string"
                    ? "opacity-50 cursor-not-allowed "
                    : "hover:bg-gray-900 ") + "px-6 py-2 bg-gray-700 rounded"
                }
              >
                {page}
              </button>
            </Link>
          ) : (
            <button
              key={index}
              onClick={async () => {
                if (typeof page === "number") changeIndicePagina(page - 1);
              }}
              className={
                (typeof page === "number" && page - 1 === current
                  ? "opacity-50 cursor-not-allowed "
                  : typeof page === "string"
                  ? "opacity-50 cursor-not-allowed "
                  : "hover:bg-gray-900 ") + "px-6 py-2 bg-gray-700 rounded"
              }
            >
              <span className="cursor-pointer m-auto">{page}</span>
            </button>
          )
        )}
      </div>
      <div className="gap-2 flex">
        <button
          onClick={async () => changeIndicePagina(current + 1)}
          disabled={current + 1 === totalIndices}
          className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {createPageURL && current + 2 <= totalIndices ? (
            <Link href={createPageURL(current + 2)}>
              <ChevronRightIcon />
            </Link>
          ) : (
            <ChevronRightIcon />
          )}
        </button>
        <button
          onClick={async () => changeIndicePagina(totalIndices - 1)}
          disabled={current + 1 === totalIndices}
          className="w-8 bg-gray-700 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {createPageURL && current + 2 <= totalIndices ? (
            <Link href={createPageURL(totalIndices)}>
              <ChevronDoubleRightIcon />
            </Link>
          ) : (
            <ChevronDoubleRightIcon />
          )}
        </button>
      </div>
    </div>
  );
}
