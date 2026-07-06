function AuthHeader({ className, ...props }) {
  return (
    <div
      data-slot="auth-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}