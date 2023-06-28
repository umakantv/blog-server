
//OpenTelemetry
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { 
  // ConsoleSpanExporter, 
  SimpleSpanProcessor 
} = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//instrumentations
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { TRACE_ENDPOINT } = require("../config");

//Exporter
module.exports = (serviceName) => {
  // const exporter = new ConsoleSpanExporter();
  const exporter = new JaegerExporter({
    endpoint: TRACE_ENDPOINT,
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