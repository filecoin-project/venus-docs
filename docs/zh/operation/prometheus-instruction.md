# prometheus 使用说明

本文主要介绍 `prometheus` 的基本部署，及用其监控 `venus` 系统指标的基本方案。

## 配置解析

默认的配置文件为 `prometheus.yml`
```yaml
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]
 
  # 配置采集点,一个job可对应一个或多个采集点
  - job_name: "venus"
  
    metrics_path: "/metrics"
    scheme: "http"
  
    static_configs:
      - targets: ["localhost:4567", "localhost:5678"]
```

### 服务发现

可以通过额外的文件来配置采集点，支持热加载，相当于基于文件的服务发现。

`prometheus.yml`
```yaml
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]
 
  # 热加载
  - job_name: "venus"
   
    file_sd_configs:
      - files: 
        - "./venus.yml"
      
        # 多久重新加载
        refresh_interval: 10m
```

`venus` 每个实现指标监控的服务可以认为是单独的采集点。下面配置采集 `venus-miner` 和 `venus-messager` 的监控指标。文件名为 `venus.yml`。

```yaml
# 该文件中的每一个targets都是一个采集点
- targets:
  # venus-miner 指标监控服务地址
  - "<ip>:<port>" 
  labels:
    __metrics_path__: "/debug/metrics"
    instance: "miner"
  
- targets:
  # venus-messager 指标监控服务地址
  - "<ip>:<port>"
  labels:
    __metrics_path__: "/debug/metrics"  
    instance: "messager"
```

## 启动
```bash
$ ./prometheus --config.file=prometheus.yml
```
http://localhost:9090/targets, 可查询组件的指标。


