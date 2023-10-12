import { useRouter } from 'next/router';

export default function Export() {
    const router = useRouter();
    const { data } = router.query;

    // Use the data in your ResultPage component
    // Example: Display the data
    return (
        <div className='margin-3'>
            <h1>Result Page</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}