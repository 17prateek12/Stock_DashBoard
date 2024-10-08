import { FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slice/authSlice';
import Button from "./Button";
import { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); 
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const { isAuthenticated, error } = useSelector((state: RootState) => state.auth); 

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home'); 
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="w-full px-4 py-8 mx-auto">
            <div className="w-full flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Enter valid Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-8 bg-white rounded-lg my-4 px-4 focus:outline-none border border-btn"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-8 bg-white rounded-lg my-4 px-4 focus:outline-none border border-btn"
                    />
                    <Button type="submit">Login</Button> {/* Use Button component */}
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export { LoginForm };
