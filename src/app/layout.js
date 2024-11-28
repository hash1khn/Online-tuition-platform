"use client";

// Scrollbar
import 'simplebar-react/dist/simplebar.min.css';
import { SessionProvider } from 'next-auth/react';

// Image
import 'react-lazy-load-image-component/src/effects/blur.css';

// External Libraries
import PropTypes from 'prop-types';

// Theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

// Components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
import FloatingChatButton from 'src/components/FloatingButton';

// Auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';
import ClientProvider from "./ClientProvider";
import { metadata } from './metadata';

// ----------------------------------------------------------------------

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <SessionProvider session={session}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light',
                themeDirection: 'ltr',
                themeContrast: 'default',
                themeLayout: 'vertical',
                themeColorPresets: 'default',
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SettingsDrawer />
                  <ProgressBar />
                  <AuthConsumer>
                    <ClientProvider>
                      {children}
                    </ClientProvider>
                  </AuthConsumer>
                </MotionLazy>
                {/* Floating Chat Button */}
                <FloatingChatButton />
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object,
};
