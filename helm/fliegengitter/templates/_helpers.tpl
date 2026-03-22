{{/*
Chart name
*/}}
{{- define "fliegengitter.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Environment suffix
*/}}
{{- define "fliegengitter.env" -}}
{{- .Values.global.environment }}
{{- end }}

{{/*
Frontend resource name
*/}}
{{- define "fliegengitter.frontend.name" -}}
fliegengitter-shop-{{ include "fliegengitter.env" . }}
{{- end }}

{{/*
Backend resource name
*/}}
{{- define "fliegengitter.backend.name" -}}
medusa-backend-{{ include "fliegengitter.env" . }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "fliegengitter.labels" -}}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: fliegengitter
environment: {{ include "fliegengitter.env" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "fliegengitter.frontend.selectorLabels" -}}
app: {{ include "fliegengitter.frontend.name" . }}
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "fliegengitter.backend.selectorLabels" -}}
app: {{ include "fliegengitter.backend.name" . }}
{{- end }}
