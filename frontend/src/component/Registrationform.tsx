import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../slice/authSlice';
import Button from "./Button";
import { AppDispatch } from '../store/store';

const Registrationform = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(registerUser({ username, email, password }));
    };

    return (
        <div className="w-full px-4 py-8 mx-auto">
            <div className="w-full flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="UserName"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-8 bg-white rounded-lg my-4 px-4 focus:outline-none border border-btn"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-8 bg-white rounded-lg my-4 px-4 focus:outline-none border border-btn"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-8 bg-white rounded-lg my-4 px-4 focus:outline-none border border-btn"
                    />
                    <Button type="submit">Sign Up</Button> {/* Pass type="submit" */}
                </form>
            </div>
        </div>
    );
};

export default Registrationform;
