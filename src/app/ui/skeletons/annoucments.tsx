import { ArrowRightIcon } from '@heroicons/react/24/outline';

const shimmerEffect = 'animate-[shimmer_3s_infinite]';
const shimmerGradient = 'bg-gradient-to-r from-transparent via-white/5 to-transparent';

export default function PostsWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-md bg-slate-700 p-4 md:gap-4">
        <div className={`${shimmerEffect} ${shimmerGradient} absolute inset-0`} />

        <h1 className="relative overflow-hidden rounded-md bg-slate-800 p-2 py-6 text-xl" />

        <div className="relative flex justify-between overflow-hidden rounded-md bg-slate-800 p-4 py-6">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4 py-12">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-md bg-slate-700 p-4 md:gap-4">
        <div className={`${shimmerEffect} ${shimmerGradient} absolute inset-0`} />

        <h1 className="relative overflow-hidden rounded-md bg-slate-800 p-2 py-6 text-xl" />

        <div className="relative flex justify-between overflow-hidden rounded-md bg-slate-800 p-4 py-6">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4 py-12">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
        </div>
      </div>{' '}
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-md bg-slate-700 p-4 md:gap-4">
        <div className={`${shimmerEffect} ${shimmerGradient} absolute inset-0`} />

        <h1 className="relative overflow-hidden rounded-md bg-slate-800 p-2 py-6 text-xl" />

        <div className="relative flex justify-between overflow-hidden rounded-md bg-slate-800 p-4 py-6">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400" />
            <h2 className="text-xl" />
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4 py-12">
            <p className="text-sm text-slate-400" />
            <div className="flex flex-col">
              <strong />
              <p />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4 py-10">
            <p className="text-sm text-slate-400" />
            <p className="text-center text-xl md:text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
