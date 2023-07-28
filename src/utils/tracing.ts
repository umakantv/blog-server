//OpenTelemetry
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  // ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { trace } from "@opentelemetry/api";
//instrumentations
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import config from "../config";

//Exporter
export default (serviceName: string) => {
  // const exporter = new ConsoleSpanExporter();
  const exporter = new JaegerExporter({
    endpoint: config.TRACE_ENDPOINT,
  });
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new MongoDBInstrumentation(),
    ],
    tracerProvider: provider,
  });
  return trace.getTracer(serviceName);
};
