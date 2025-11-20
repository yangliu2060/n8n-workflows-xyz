"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("已复制到剪贴板", {
        description: "JSON 配置已成功复制",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("复制失败", {
        description: "请手动选择并复制",
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy} className={className}>
      {copied ? "已复制 ✓" : "复制 JSON"}
    </Button>
  );
}
