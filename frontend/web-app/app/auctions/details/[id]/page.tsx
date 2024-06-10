export default function Details({params}: {params: {id: string}}) {
    return (
        <div>
            Auction details for {params.id}
        </div>
    );
}