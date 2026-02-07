"use client";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
}

/**
 * 基础卡片组件
 */
export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-background text-foreground",
    outlined: "border border-border bg-background",
    elevated: "shadow-lg bg-background",
  };

  return (
    <div
      className={`rounded-lg ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 卡片头部
 */
export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 卡片标题
 */
export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * 卡片描述
 */
export function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-muted-foreground ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * 卡片内容
 */
export function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

/**
 * 卡片底部
 */
export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
