"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  analyzeSpecSchema,
  type AnalyzeSpecFormData,
} from "../schemas/analyze-spec.schema";

interface UploadFormProps {
  onSubmit: (data: AnalyzeSpecFormData) => void;
}

export function UploadForm({ onSubmit }: UploadFormProps) {
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

  return (
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
          <p className="mt-1 text-sm text-red-600">{errors.specFile.message}</p>
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
        disabled={!isValid}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Analyser le document
      </button>
    </form>
  );
}
