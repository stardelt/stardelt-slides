---
theme: default
colorSchema: dark
highlighter: shiki
lineNumbers: false
transition: slide-left
title: stardelt — your own data platform
info: |
  ## stardelt
  Your own data platform: Iceberg, SQL, pipelines, notebooks, streams and
  dashboards behind one sign-in, one interface and one API, inside your own
  Kubernetes.
class: text-center
layout: cover
---

# stardelt

### Your own data platform

One sign-in, one interface, one API — inside your own Kubernetes.

<div class="pt-10 text-sm opacity-70">
Open source · Apache 2.0 components · Kubernetes-native
</div>

---
layout: center
---

# Data platforms are rented, not owned

<div class="grid grid-cols-2 gap-6 pt-6 text-left text-[1.05rem]">

<div>

**Rented** — a managed control plane, a per-seat bill, a region you do not choose.

**Fragmented** — one vendor for the catalog, another for SQL, a third for pipelines, a fourth for BI.

</div>
<div>

**Locked in** — your tables live in a format only the vendor reads well.

**Opaque** — you cannot see the query, the grant or the job without asking support.

</div>
</div>

---
layout: center
---

# What stardelt is

<div class="grid grid-cols-3 gap-6 pt-8 text-left">

<div class="p-5 rounded-xl bg-white/5">

### One sign-in
Your identity provider, your groups, your policies. Keycloak included, or bring your own OIDC.

</div>
<div class="p-5 rounded-xl bg-white/5">

### One interface
Catalog, SQL, pipelines, notebooks, streams and dashboards in one place — stardelt Nova.

</div>
<div class="p-5 rounded-xl bg-white/5">

### One API
Every screen is a documented API call. Kubernetes resources describe the platform itself.

</div>
</div>

---
layout: default
---

# The shape of it

<div class="flex justify-center pt-2">

<img src="/img/architecture-layers.svg" alt="stardelt architecture: Nova and the operator on top, the always-installed core stack, optional services, and your Kubernetes underneath" style="max-height: 380px; width: auto;" />

</div>

<div class="text-sm opacity-70 text-center pt-2">
Control plane, data plane, applications and platform services. On your Kubernetes, nothing calls home.
</div>

---
layout: center
---

# The lakehouse core

<div class="grid grid-cols-2 gap-6 pt-6 text-left">

<div>

**Apache Iceberg** — the table format every engine reads and writes. Not a service you install.

**Lakekeeper** — the Iceberg REST catalog: metadata, warehouses, short-lived credentials.

</div>
<div>

**Trino** — one SQL engine over every table you may read.

**SeaweedFS** — S3-compatible storage by default. Bring your own bucket instead.

</div>
</div>

---
layout: two-cols
---

# One interface

<br>

- Catalog explorer over every catalog you may see
- SQL editor with results, history and lineage
- Pipelines, notebooks and streams in the same place
- Dashboards from Superset, embedded with the same sign-in
- A platform health view that reports what is actually running

::right::

<img src="/img/nova-overview.png" alt="stardelt Nova overview: catalogs, recent activity and platform apps" class="w-full rounded-lg shadow-2xl mt-16" />

---
layout: two-cols
---

# Find the data

<br>

- Catalogs, schemas, tables and views in one tree
- Columns, partitions, snapshots and table history
- Descriptions, tags and owners next to the data
- Lineage from the table you are looking at

::right::

<img src="/img/nova-catalog.png" alt="stardelt Nova catalog explorer with catalogs, schemas and tables" class="w-full rounded-lg shadow-2xl mt-16" />

---
layout: center
---

# Streaming that is a resource, not a project

<div class="grid grid-cols-2 gap-8 pt-4 text-left">

<div>

A `StreamApp` is a Kafka topic in and an Iceberg table out. The operator creates the
application, the checkpoint on S3 and the status a reader can trust.

</div>
<div>

```yaml
apiVersion: stardelt.io/v1alpha1
kind: StreamApp
metadata: { name: pegelonline }
spec:
  source: { topic: pegelonline.measurements }
  sink:
    catalog: mobility
    table: bronze.pegelonline_continuous
    mode: merge
    mergeKeys: [station_uuid, timeseries, measured_at]
  ownerGroup: mobility-analytics
```

</div>
</div>

---
layout: center
---

# The platform is a resource, too

<div class="grid grid-cols-2 gap-8 pt-4 text-left">

<div>

`PlatformInstance` describes an installation: the domain, the identity mode, the
pillars that are on. `Catalog` and `SqlWarehouse` describe data domains and compute;
`Connection` and `ServicePrincipal` describe how jobs reach the outside world.

</div>
<div>

```yaml
apiVersion: stardelt.io/v1alpha1
kind: PlatformInstance
metadata: { name: alpha }
spec:
  baseDomain: alpha.example.com
  identity:
    mode: platform        # or external: your IdP
    adminGroup: platform-admins
  pillars:
    batch: true
    notebooks: true
    dashboards: true
    streaming: true
```

</div>
</div>

---
layout: center
---

# Open and sovereign

<div class="grid grid-cols-2 gap-6 pt-6 text-left">

<div>

**Permissive only.** Apache 2.0 and MIT: Trino, Iceberg, Airflow, Superset, JupyterHub,
Keycloak, CloudNativePG, Strimzi, and the stardelt components themselves.

</div>
<div>

**Yours at every layer.** Your Kubernetes, your object store, your identity provider,
your network. No license server, no phone-home at runtime.

</div>
</div>

---
layout: center
---

# Today

<div class="pt-4 text-left max-w-3xl mx-auto">

- **0.x, pre-alpha** — the platform is being built in the open, and it changes quickly
- **Working today:** catalog, SQL, Iceberg tables, pipelines, notebooks, service principals, streams, dashboards, backups
- **Next:** one-command installs on a fresh node, more pipelines and ingestion, the roadmap on the site

</div>

---
layout: center
class: text-center
---

# Start it on your own cluster

<div class="pt-8 text-[1.1rem] leading-relaxed">

**Docs** — [stardelt.io/docs](https://stardelt.io/docs)
**Quickstart** — [stardelt.io/docs/getting-started/quickstart](https://stardelt.io/docs/getting-started/quickstart)
**Source** — [github.com/stardelt](https://github.com/stardelt)

</div>

<div class="pt-12 text-sm opacity-60">
stardelt · your own data platform
</div>
