"use client"
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import Layout from '../public/components/Layout';
import Dashboard from '../public/components/Dashboard';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const startRegistrationMutation = trpc.startRegistration.useMutation();
  const verifyRegistrationMutation = trpc.verifyRegistration.useMutation();
  const startAuthenticationMutation = trpc.startAuthentication.useMutation();
  const verifyAuthenticationMutation = trpc.verifyAuthentication.useMutation();

  const handleRegistration = async () => {
    try {
      const options = await startRegistrationMutation.mutateAsync({ email });
      const attResp = await startRegistration(options);
      const verificationResp = await verifyRegistrationMutation.mutateAsync({
        email,
        response: attResp,
      });
      if (verificationResp) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleAuthentication = async () => {
    try {
      const options = await startAuthenticationMutation.mutateAsync({ email });
      const attResp = await startAuthentication(options);
      const verificationResp = await verifyAuthenticationMutation.mutateAsync({
        email,
        response: attResp,
      });
      if (verificationResp) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cloud Storage App</h1>
      {!isAuthenticated ? (
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border p-2 mr-2"
          />
          <button onClick={handleRegistration} className="bg-blue-500 text-white p-2 mr-2">
            Register
          </button>
          <button onClick={handleAuthentication} className="bg-green-500 text-white p-2">
            Login
          </button>
        </div>
      ) : (
        <Dashboard />
      )}
    </Layout>
  );
}