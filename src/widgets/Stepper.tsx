"use client";

type Props = {
  currentStep: number;
  titles: string[]; // length 5 expected
};

export default function Stepper({ currentStep, titles }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">作成工程</h2>
      <div className="flex items-center justify-between" id="progress-steps">
        {[1, 2, 3, 4, 5].map((n) => (
          <div className="flex items-center" key={n}>
            <div className="flex items-center flex-col">
              <div className={`w-8 h-8 ${n <= currentStep ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"} rounded-full flex items-center justify-center text-sm font-bold step-circle`} data-step={n}>{n}</div>
              <span className="text-sm text-gray-600 mt-2">{titles[n - 1]}</span>
            </div>
            {n < 5 && <div className={`w-16 h-1 ${n < currentStep ? "bg-blue-600" : "bg-gray-300"} mx-2 step-line`} data-step={n}></div>}
          </div>
        ))}
      </div>
    </div>
  );
}


