import { useState } from 'react';
import { User, Address } from '../types';
import "../app/pages.css"
import axios from 'axios';

interface UserFormProps {
    user: User | null;
    onClose: () => void;
}

const validateForm = (userData: User) => {
    const errors: Partial<User> = {};

    if (!userData.name || userData.name.length < 3 || userData.name.length > 50) {
        errors.name = 'Name should be between 3 and 50 characters';
    }
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Valid email is required';
    }
    if (!userData.linkedin || !/^https?:\/\/[a-z]{2,3}\.linkedin\.com\/.+/.test(userData.linkedin)) {
        errors.linkedin = 'Valid LinkedIn URL is required';
    }
    if (!userData.gender) {
        errors.gender = 'Gender is required';
    }

    return errors;
};

export default function UserForm({ user, onClose }: UserFormProps) {
    const [userData, setUserData] = useState<User>(
        user || {
            id: 0,
            key: "",
            name: '',
            email: '',
            linkedin: '',
            gender: '',
            address: {
                line1: '',
                state: '',
                city: '',
                pin: ''
            }
        }
    );
    const [errors, setErrors] = useState<Partial<User>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validateForm(userData);
        if (Object.keys(formErrors).length > 0) {
            try {
                let Payload = {
                    ...userData,
                    address: {
                        line1: userData.address.line1,
                        state: userData.address.state,
                        city: userData.address.city,
                        pin: userData.address.pin
                    }
                }
                if (userData.id?.length > 0) {
                    axios.put(`https://66fad8b5858383ac93b40a2401.mockapi.io/api/v1/linkedin-profile/linkedin-profile/${userData.id}`);
                    onClose();
                }
                else {
                    axios.post('https://66fad8b58583ac93b40a2401.mockapi.io/api/v1/linkedin-profile/linkedin-profile', Payload)
                    onClose();
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setErrors(formErrors);
        } else {
            onClose();
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedState = e.target.value;
        setUserData({
            ...userData,
            address: { ...userData.address, state: selectedState, city: '' }
        });
    };


    interface StateCityData {
        [key: string]: string[];
    }

    const stateCityData: StateCityData = {
        California: ['Los Angeles', 'San Francisco', 'San Diego'],
        Texas: ['Houston', 'Dallas', 'Austin'],
        'New York': ['New York City', 'Buffalo', 'Rochester'],
    };

    console.log(userData.gender, 'pay select');

    return (
        <form onSubmit={handleSubmit} className='form-container'>
            <div className='form-control'>
                <label>Name</label>
                <input
                    style={{ padding: '10px', width: '80%' }}
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                {errors.name && <span>{errors.name}</span>}
            </div>

            <div className='form-control'>
                <label>Email</label>
                <input
                    style={{ padding: '10px', width: '80%' }}

                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
                {errors.email && <span>{errors.email}</span>}
            </div>

            <div className='form-control'>
                <label>LinkedIn URL</label>
                <input
                    style={{ padding: '10px', width: '80%' }}

                    type="url"
                    value={userData.linkedin}
                    onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                />
                {errors.linkedin && <span>{errors.linkedin}</span>}
            </div>

            <div className='form-control'>
                <label>Gender</label>
                <select
                    style={{ padding: '10px', width: '80%' }}
                    value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                {errors.gender && <span>{errors.gender}</span>}
            </div>

            <div className='form-control'>
                <label>Address Line 1</label>
                <input
                    style={{ padding: '10px', width: '80%' }}
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) => setUserData({ ...userData, address: { ...userData.address, line1: e.target.value } })}
                />
            </div>


            <div className='form-control'>
                <label>State</label>
                <select
                    style={{ padding: '10px', width: '80%' }}
                    value={userData.address.state} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {Object.keys(stateCityData).map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            <div className='form-control'>
                <label>City</label>
                <select
                    style={{ padding: '10px', width: '80%' }}
                    value={userData.address.city} onChange={(e) => setUserData({ ...userData, address: { ...userData.address, city: e.target.value } })}>
                    <option value="">Select City</option>
                    {stateCityData[userData?.address?.state]?.map((city: string) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            <div className='form-control'>
                <label>PIN</label>
                <input
                    style={{ padding: '10px', width: '80%' }}

                    type="text"
                    value={userData.address.pin}
                    onChange={(e) => setUserData({ ...userData, address: { ...userData.address, pin: e.target.value } })}
                />
            </div>
            <div className='button-container'>
                <button className='cancel-button' type="button" onClick={onClose}>Cancel</button>
                <button className='submit-button' type="submit">Submit</button>
            </div>
        </form>
    );
}
