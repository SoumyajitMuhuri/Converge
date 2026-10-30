import { useEffect } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export function useDashboardEvents(onVisitRecorded) {
  useEffect(() => {
    const controller = new AbortController();

    const connect = async () => {
      while (!controller.signal.aborted) {
        try {
          const token = localStorage.getItem("token");

          if (!token) return;

          const response = await fetch(
            `${API_BASE_URL}/api/analytics/events`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/event-stream",
              },
              signal: controller.signal,
            },
          );

          if (!response.ok) {
            throw new Error(
              `Dashboard event connection failed: ${response.status}`,
            );
          }

          if (!response.body) {
            throw new Error("Streaming is not supported by this response.");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (!controller.signal.aborted) {
            const { value, done } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";

            for (const rawEvent of events) {
              let eventName = "message";
              let eventData = "";

              for (const line of rawEvent.split("\n")) {
                if (line.startsWith("event:")) {
                  eventName = line.slice(6).trim();
                } else if (line.startsWith("data:")) {
                  eventData += line.slice(5).trim();
                }
              }

              if (eventName === "visit-recorded" && eventData) {
                try {
                  onVisitRecorded(JSON.parse(eventData));
                } catch (error) {
                  console.error("Failed to process dashboard event:", error);
                }
              }
            }
          }

          if (!controller.signal.aborted) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (error) {
          if (controller.signal.aborted) break;

          console.error("Dashboard event connection error:", error.message);

          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    };

    connect();

    return () => {
      controller.abort();
    };
  }, [onVisitRecorded]);
}