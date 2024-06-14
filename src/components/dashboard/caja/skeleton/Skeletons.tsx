export function CardSkeleton() {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-500 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-400" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-400 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-gray-400 px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-300" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-500" />
      <div className="rounded-xl bg-gray-500 p-4">
        <div className="mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-gray-200 p-4 sm:grid-cols-13 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-400" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-400" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-500 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-400" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-400" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-400" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-400" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-500" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-600 p-4">
        <div className="bg-gray-500 px-6 rounded-md">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full bg-gray-500" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
