// components/ui/loading-dots.tsx
export function LoadingDots() {
	return (
		<span className="inline-flex gap-1 ml-1">
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0s]" />
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.2s]" />
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.4s]" />
    </span>
	)
}
