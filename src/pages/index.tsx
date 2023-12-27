import HomeComponent from '@/components/home/homeComponent';
import Layout from '@/components/layout';

function HomePage() {
    return (
        <Layout title="Home" content="Home Page">
            <HomeComponent />
        </Layout>
    )
}

export default HomePage