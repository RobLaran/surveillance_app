// components/ui/auth-card.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckSquare } from 'lucide-react';

interface AuthCardProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  className?: string;
  showFooter?: boolean;
}

/**
 * A styled card wrapper for authentication forms, matching AI Sentinel design.
 * @param {AuthCardProps} props
 * @returns {JSX.Element}
 */
export function AuthCard({ children, headerTitle, headerDescription, className, showFooter = true }: AuthCardProps) {
  return (
    <div className={`w-full max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in-90 duration-500 ${className}`}>
      {/* AI Sentinel Logo and Title */}
      <div className="flex flex-col items-center justify-center space-y-2 mb-8">
        <div className="main-logo-icon-container">
          <Shield className="main-logo-icon" /> {/* Main shield icon for the logo */}
        </div>
        <h1 className="text-4xl font-bold text-foreground">AI Sentinel</h1>
        <p className="text-muted-foreground">Smart Home Surveillance</p>
      </div>

      <Card className="auth-card-bg border-none shadow-xl w-full">
        {headerTitle && (
          <CardHeader className="text-left pb-4 pt-8 px-6">
            <CardTitle className="text-2xl font-bold text-light-foreground">{headerTitle}</CardTitle>
            <CardDescription className="text-muted-foreground">{headerDescription}</CardDescription>
          </CardHeader>
        )}
        <CardContent className="py-6 px-6">
          {children}
        </CardContent>
      </Card>

      {showFooter && (
        <div className="text-auth-text-muted text-xs space-y-3 mt-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" style={{ color: 'var(--auth-primary-green)' }} />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" style={{ color: 'var(--auth-primary-green)' }} />
              <span>Admin only</span>
            </div>
          </div>
          <p>AI Sentinel v1.0 - Unauthorized access is prohibited</p>
        </div>
      )}
    </div>
  );
}