// pages/auth/signin.tsx
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // signIn returns { ok, error, status, url } if using signIn() in "redirect: false" mode
    // but by default signIn tries to redirect.
    const result = await signIn('credentials', {
      redirect: false, // we handle redirect manually
      email,
      password,
    });

    if (result?.error) {
      setErrorMsg('Invalid email or password');
    } else {
      // On success, redirect to homepage or an admin page, etc.
      router.push('/');
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h2>Sign In</h2>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign In
        </Button>
      </Form>
    </Container>
  );
}
