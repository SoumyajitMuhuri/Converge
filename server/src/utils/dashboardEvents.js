const dashboardClients = new Map();

export const addDashboardClient = (userId, res) => {
    const clients = dashboardClients.get(userId) ?? new Set();

    clients.add(res);
    dashboardClients.set(userId, clients);
};

export const removeDashboardClient = (userId, res) => {
    const clients = dashboardClients.get(userId);

    if(!clients) return;

    clients.delete(res);

    if (clients.size === 0){
        dashboardClients.delete(userId);
    }
};

export const sendDashboardEvent = (userId, event, data) => {

    const clients = dashboardClients.get(userId);

    if(!clients){
        return;
    }

    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients){
    if(res.writableEnded || res.destroyed){
        removeDashboardClient(userId, res);
        continue;
    }

    res.write(message);
}
};
