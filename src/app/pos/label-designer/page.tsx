"use client";

import { Suspense } from "react";
import BarcodeLabelPage from "@/src/components/label-designer/ListLabelDesigner";

const page = () => {
  return (
    <Suspense fallback={null}>
      <BarcodeLabelPage />
    </Suspense>
  );
};

export default page;