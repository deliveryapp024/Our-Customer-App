type TelemetryPayload = Record<string, unknown>;

const nowIso = () => new Date().toISOString();

export const trackClientEvent = (event: string, payload: TelemetryPayload = {}) => {
    const line = {
        level: 'info',
        source: 'customer_app',
        event,
        timestamp: nowIso(),
        ...payload,
    };
    // Console logging is intentional for current ops/debug flow.
    // Can be replaced with remote sink later without changing call sites.
    console.log(JSON.stringify(line));
};

export const trackClientError = (event: string, payload: TelemetryPayload = {}) => {
    const line = {
        level: 'error',
        source: 'customer_app',
        event,
        timestamp: nowIso(),
        ...payload,
    };
    console.error(JSON.stringify(line));
};

