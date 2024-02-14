fetchResponse = (link, link_data, callback, refreshInterval) => {
    const fetchData = () => {
        fetch(link, link_data)
            .then((res) => res.text())
            .then((data) => JSON.parse(data))
            .then((data) => {
                callback(null, data);
                // Schedule the next refresh
                setTimeout(fetchData, refreshInterval);
            })
            .catch((error) => {
                callback(error, null);
                console.log(error);
                // Retry after an interval on error
                setTimeout(fetchData, refreshInterval);
            });
    };

    // Initial call to start fetching
    fetchData();

    // Return a function to stop auto-refresh if needed
    return () => {
        clearTimeout(refreshInterval);
    };
};

// Example usage with auto-refresh every 5000 milliseconds (5 seconds)
const stopAutoRefresh = fetchResponse(
    'https://example.com/api/data',
    { method: 'GET' },
    (error, data) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            console.log('Fetched data:', data);
        }
    },
    5000
);

// To stop auto-refresh, call the function returned by fetchResponse
// stopAutoRefresh();