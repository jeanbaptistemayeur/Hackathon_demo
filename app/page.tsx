"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeSpecSchema,
  type AnalyzeSpecFormData,
} from "./schemas/analyze-spec.schema";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AnalyzeSpecFormData>({
    resolver: zodResolver(analyzeSpecSchema),
    mode: "onChange",
  });

  const specFile = watch("specFile");
  const profileFile = watch("profileFile");

  const onSubmit = async (data: AnalyzeSpecFormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("specFile", data.specFile[0]);
    formData.append("profileFile", data.profileFile[0]);

    const res = await fetch("/api/analyze-spec", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    setResult(json.structured);
    setRawText(json.rawText);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Proposal Generator</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specification Document (.docx / .pdf)
            </label>
            <input
              type="file"
              accept=".docx,.pdf"
              {...register("specFile")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {specFile?.[0] && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {specFile[0].name}
              </p>
            )}
            {errors.specFile && (
              <p className="mt-1 text-sm text-red-600">
                {errors.specFile.message}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Profile (.json)
            </label>
            <input
              type="file"
              accept=".json"
              {...register("profileFile")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {profileFile?.[0] && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {profileFile[0].name}
              </p>
            )}
            {errors.profileFile && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profileFile.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Specification"}
          </button>
        </form>

        {result && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Structured Data
            </h2>
            <pre className="p-4 bg-gray-50 rounded text-xs text-gray-800 overflow-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {rawText && (
          <details className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Raw Extracted Text
            </summary>
            <pre className="mt-4 p-4 bg-gray-50 rounded text-xs text-gray-600 overflow-auto whitespace-pre-wrap">
              {rawText}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
