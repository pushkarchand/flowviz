import React from 'react';

const NotFoundPage: React.FC = () => (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a href="/">Go to Home</a>
    </div>
);

export default NotFoundPage;
