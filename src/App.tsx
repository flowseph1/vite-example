import axios from 'axios';
import { ChangeEvent, ChangeEventHandler, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Person {
    cell: string;
    dob: { date: string; age: number };
    email: string;
    gender: string;
    id: { name: string; value: string };
    location: {
        city: string;
        country: string;
        postcode: number;
        state: string;
        street: { number: number; name: string };
    };
    name: { first: string; last: string; title: string };
    phone: string;
    picture: { large: string; medium: string };
    registered: { date: string };
}

type Gender = 'male' | 'female' | 'all';

function App() {
    // Refs.
    const allTab = useRef<HTMLDivElement>(null);
    const slideActive = useRef<HTMLDivElement>(null);

    // States.
    const [persons, setPersons] = useState<Person[] | null>(null);

    const [selectedGender, setSelectedGender] = useState<Gender>('all');

    const [filter, setFilter] = useState<Person[] | null | undefined>(null);

    const [tabPosition, setTabPosition] = useState({
        left: allTab.current?.offsetLeft,
        top: allTab.current?.offsetTop,
        width: allTab.current?.clientWidth,
        height: allTab.current?.clientHeight,
    });

    // Effects.
    useEffect(() => {
        const getPersons = async () => {
            const { data } = await axios.get('https://randomuser.me/api/?results=50');
            setPersons(data?.results);
            setFilter(data?.results);
        };

        getPersons();

        return () => {};
    }, []);

    useEffect(() => {
        if (selectedGender != 'all') {
            setFilter(persons?.filter(person => person.gender === selectedGender));
        } else {
            setFilter(persons);
        }
    }, [selectedGender]);

    useEffect(() => {
        const left = allTab.current?.offsetLeft;
        const top = allTab.current?.offsetTop;
        const width = allTab.current?.clientWidth;
        const height = allTab.current?.clientHeight;

        setTabPosition({
            left: left,
            top: top,
            width: width,
            height: height,
        });
    }, []);

    const setSlidePosition = (e: MouseEvent, param: Gender) => {
        const element = e.target as HTMLElement;
        console.log(element.offsetLeft);
        console.log(element.offsetTop);

        setTabPosition({
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.clientWidth,
            height: element.clientHeight,
        });
        setSelectedGender(param);
    };

    // Logs.
    console.log();

    return (
        <div className="h-screen flex  flex-col">
            <h1 className="text-2xl font-bold p-5 primary-font border-b-[1px] ">Find Friends</h1>
            <nav className="flex space-x-3 p-5 relative z-50">
                <div className="relative flex shadow-sm rounded-full p-2">
                    <div
                        className={`tab ${selectedGender === 'male' && '!text-white'}`}
                        onClick={e => setSlidePosition(e, 'male')}
                    >
                        Male
                    </div>
                    <div
                        className={`tab ${selectedGender === 'female' && '!text-white'}`}
                        onClick={e => setSlidePosition(e, 'female')}
                    >
                        Female
                    </div>

                    <div
                        className={`tab ${selectedGender === 'all' && '!text-white'}`}
                        onClick={e => setSlidePosition(e, 'all')}
                        ref={allTab}
                    >
                        All
                    </div>

                    <motion.div
                        animate={{
                            left: tabPosition.left,
                            top: tabPosition.top,
                            width: tabPosition.width,
                            height: tabPosition.height,
                            transition: { bounce: 0.1, duration: 0.2 },
                        }}
                        className={`absolute active rounded-full -z-[99]`}
                    />
                </div>
            </nav>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] w-full px-10 gap-4">
                {filter?.map(person => (
                    <div
                        key={`${person.name.first} - ${person.name.last}`}
                        className="flex space-y-2 cursor-pointer hover:bg-gray-100 rounded-md p-3 relative"
                    >
                        <div className="min-h-20 min-w-20">
                            <img src={person.picture.large} alt="" className="h-20 w-20 rounded-full object-cover" />
                        </div>
                        <div className="ml-2">
                            <p className="font-semibold truncate w-24">
                                {person.name.first} {person.name.last}
                            </p>
                            <p className="text-xs truncate w-20">{person.email}</p>
                            <p>
                                {person.dob.age} <span className="text-gray-400 text-sm">years old</span>
                            </p>
                        </div>
                        <div
                            className={`status ${
                                new Date(person.dob.date) > new Date('1980-01-01') ? 'connected' : 'offline'
                            }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
