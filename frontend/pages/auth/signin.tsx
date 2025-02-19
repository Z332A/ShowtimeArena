// pages/auth/signin.tsx
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/new-booking'); // Redirect to booking page after login
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Sign In</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSignIn}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign In
        </Button>
      </Form>

      <div className="text-center mt-3">
        <small>
          Don't have an account? <a href="/auth/signup">Sign up here</a>
        </small>
      </div>
    </Container>
  );
};

export default SignInPage;
