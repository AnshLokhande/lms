import AdminEventDetails from '../../../components/AdminEventDetails';

const EventDetailsPage = ({ params }) => {
    return <AdminEventDetails params={params} />;
};

export async function getServerSideProps(context) {
    return {
        props: {
            params: context.params,
        },
    };
}

export default EventDetailsPage;
