<?php

namespace BitApps\Pi\Services\Flow;

use BitApps\Pi\Config;
use stdClass;

abstract class TaskQueueHandler extends AsyncRequest
{
    /**
     * The status set when process is cancelling.
     */
    public const STATUS_CANCELLED = 1;

    /**
     * The status set when process is paused or pausing.
     */
    public const STATUS_PAUSED = 2;

    /**
     * Action
     *
     * (default value: 'background_process')
     *
     * @var string
     *
     * @access protected
     */
    protected $action = 'background_process';

    /**
     * Start time of current process.
     *
     * (default value: 0)
     *
     * @var int
     *
     * @access protected
     */
    protected $startTime = 0;

    /**
     * cronHookIdentifier
     *
     * @var string
     *
     * @access protected
     */
    protected $cronHookIdentifier;

    /**
     * cronIntervalIdentifier
     *
     * @var string
     *
     * @access protected
     */
    protected $cronIntervalIdentifier;

    // protected $isSkipNextNodes = false;

    private $flowId;

    private $flowHistoryId;

    private $executedIds = [];

    private $currentNode;

    private $triggerData = [];

    private $listenerType;

    /**
     * Initiate new background process.
     */
    public function __construct()
    {
        parent::__construct();

        $this->cronHookIdentifier = $this->identifier . '_cron';
        $this->cronIntervalIdentifier = $this->identifier . '_cron_interval';

        add_action($this->cronHookIdentifier, [$this, 'handleCronHealthCheck']);
        add_filter('cron_schedules', [$this, 'scheduleCronHealthCheck']);
    }

    /**
     * Schedule the cron healthCheck and dispatch an async request to start processing the queue.
     *
     * @access public
     *
     * @return array|WP_Error|false HTTP Response array, WP_Error on failure, or false if not attempted.
     */
    public function dispatch()
    {
        if ($this->isProcessing()) {
            // Process already running.
            return false;
        }

        // Schedule the cron healthcheck.
        $this->scheduleEvent();

        // Perform remote post.
        return parent::dispatch();
    }

    /**
     * Push to the queue.
     *
     * Note, save must be called in order to persist queued items to a batch for processing.
     *
     * @param mixed $data Data.
     *
     * @return $this
     */
    public function pushToQueue($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Save the queued items for future processing.
     *
     * @return $this
     */
    public function save()
    {
        $key = $this->generateKey();
        if (!empty($this->data)) {
            update_site_option($key, $this->data);
        }

        // Clean out data so that new data isn't prepended with closed session's data.
        $this->data = [];

        return $this;
    }

    /**
     * Update a batch's queued items.
     *
     * @param string $key  Key.
     * @param array  $data Data.
     *
     * @return $this
     */
    public function update($key, $data)
    {
        if (!empty($data)) {
            update_site_option($key, $data);
        }

        return $this;
    }

    /**
     * Delete a batch of queued items.
     *
     * @param string $key Key.
     *
     * @return $this
     */
    public function delete($key)
    {
        delete_site_option($key);

        return $this;
    }

    /**
     * Delete entire job queue.
     */
    public function deleteAll()
    {
        $batches = $this->getBatches();

        foreach ($batches as $batch) {
            $this->delete($batch->key);
        }

        delete_site_option($this->getStatusKey());

        $this->cancelled();
    }

    /**
     * Cancel job on next batch.
     */
    public function cancel()
    {
        update_site_option($this->getStatusKey(), self::STATUS_CANCELLED);

        // Just in case the job was paused at the time.
        $this->dispatch();
    }

    /**
     * Has the process been cancelled?
     *
     * @return bool
     */
    public function isCancelled()
    {
        $status = get_site_option($this->getStatusKey(), 0);

        return (bool) (absint($status) === self::STATUS_CANCELLED);
    }

    /**
     * Pause job on next batch.
     */
    public function pause()
    {
        update_site_option($this->getStatusKey(), self::STATUS_PAUSED);
    }

    /**
     * Is the job paused?
     *
     * @return bool
     */
    public function isPaused()
    {
        $status = get_site_option($this->getStatusKey(), 0);

        return (bool) (absint($status) === self::STATUS_PAUSED);
    }

    /**
     * Resume job.
     */
    public function resume()
    {
        delete_site_option($this->getStatusKey());

        $this->scheduleEvent();
        $this->dispatch();
        $this->resumed();
    }

    /**
     * Is queued?
     *
     * @return bool
     */
    public function isQueued()
    {
        return !$this->isQueueEmpty();
    }

    /**
     * Is the tool currently active, e.g. starting, working, paused or cleaning up?
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->isQueued() || $this->isProcessing() || $this->isPaused() || $this->isCancelled();
    }

    /**
     * Maybe process a batch of queued items.
     *
     * Checks whether data exists within the queue and that
     * the process is not already running.
     */
    public function maybeHandle()
    {
        // Don't lock up other requests while processing.
        session_write_close();

        if ($this->isProcessing()) {
            // Background process already running.
            return $this->maybeWpDie();
        }

        if ($this->isCancelled()) {
            $this->clearScheduledEvent();
            $this->deleteAll();

            return $this->maybeWpDie();
        }

        if ($this->isPaused()) {
            $this->clearScheduledEvent();
            $this->paused();

            return $this->maybeWpDie();
        }

        if ($this->isQueueEmpty()) {
            // No data to process.
            return $this->maybeWpDie();
        }

        check_ajax_referer(Config::withPrefix('nonce'), 'nonce');

        $this->handle();

        return $this->maybeWpDie();
    }

    /**
     * Is the background process currently running?
     *
     * @return bool
     */
    public function isProcessing()
    {
        return (bool) (get_site_transient($this->identifier . '_process_lock'));
        // Process already running.
    }

    /**
     * Get batches.
     *
     * @param int $limit Number of batches to return, defaults to all.
     *
     * @return array of stdClass
     */
    public function getBatches($limit = 0)
    {
        global $wpdb;

        if (empty($limit) || !\is_int($limit)) {
            $limit = 0;
        }

        $table = $wpdb->options;
        $column = 'option_name';
        $key_column = 'option_id';
        $value_column = 'option_value';

        if (is_multisite()) {
            $table = $wpdb->sitemeta;
            $column = 'meta_key';
            $key_column = 'meta_id';
            $value_column = 'meta_value';
        }

        $key = $wpdb->esc_like($this->identifier . '_batch_') . '%';

        $sql = '
			SELECT *
			FROM ' . $table . '
			WHERE ' . $column . ' LIKE %s
			ORDER BY ' . $key_column . ' ASC
			';

        $args = [$key];

        if (!empty($limit)) {
            $sql .= ' LIMIT %d';

            $args[] = $limit;
        }

        $items = $wpdb->get_results($wpdb->prepare($sql, $args)); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

        $batches = [];

        if (!empty($items)) {
            $batches = array_map(
                function ($item) use ($column, $value_column) {
                    $batch = new stdClass();
                    $batch->key = $item->{$column};
                    $batch->data = maybe_unserialize($item->{$value_column});

                    return $batch;
                },
                $items
            );
        }

        return $batches;
    }

    /**
     * Schedule the cron healthcheck job.
     *
     * @access public
     *
     * @param mixed $schedules Schedules.
     *
     * @return mixed
     */
    public function scheduleCronHealthCheck($schedules)
    {
        $interval = apply_filters($this->cronIntervalIdentifier, 1);

        if (property_exists($this, 'cron_interval')) {
            $interval = apply_filters($this->cronIntervalIdentifier, $this->cron_interval);
        }

        if ($interval === 1) {
            $display = __('Every Minute');
        } else {
            $display = sprintf(__('Every %d Minutes', 'bit-pi'), $interval);
        }
        // Adds an "Every NNN Minute(s)" schedule to the existing cron schedules.
        $schedules[$this->cronHookIdentifier] = [
            'interval' => MINUTE_IN_SECONDS * $interval,
            'display'  => $display,
        ];

        return $schedules;
    }

    /**
     * Handle cron healthcheck event.
     *
     * Restart the background process if not already running
     * and data exists in the queue.
     */
    public function handleCronHealthCheck()
    {
        if ($this->isProcessing()) {
            exit;
        }

        if ($this->isQueueEmpty()) {
            $this->clearScheduledEvent();
            exit;
        }

        $this->dispatch();
    }

    /**
     * Called when background process has been cancelled.
     */
    protected function cancelled()
    {
        do_action($this->identifier . '_cancelled');
    }

    /**
     * Called when background process has been paused.
     */
    protected function paused()
    {
        do_action($this->identifier . '_paused');
    }

    /**
     * Called when background process has been resumed.
     */
    protected function resumed()
    {
        do_action($this->identifier . '_resumed');
    }

    /**
     * Generate key for a batch.
     *
     * Generates a unique key based on microtime. Queue items are
     * given a unique key so that they can be merged upon save.
     *
     * @param int    $length Optional max length to trim key to, defaults to 64 characters.
     * @param string $key    Optional string to append to identifier before hash, defaults to "batch".
     *
     * @return string
     */
    protected function generateKey($length = 64, $key = 'batch')
    {
        $unique = md5(microtime() . wp_rand());
        $prepend = $this->identifier . '_' . $key . '_';

        return substr($prepend . $unique, 0, $length);
    }

    /**
     * Get the status key.
     *
     * @return string
     */
    protected function getStatusKey()
    {
        return $this->identifier . '_status';
    }

    /**
     * Is queue empty?
     *
     * @return bool
     */
    protected function isQueueEmpty()
    {
        return empty($this->getBatch());
    }

    /**
     * Lock process.
     *
     * Lock the process so that multiple instances can't run simultaneously.
     * Override if applicable, but the duration should be greater than that
     * defined in the timeExceeded() method.
     */
    protected function lock_process()
    {
        $this->startTime = time(); // Set start time of current process.

        $lock_duration = property_exists($this, 'queue_lock_time') ? $this->queue_lock_time : 60; // 1 minute
        $lock_duration = apply_filters($this->identifier . '_queue_lock_time', $lock_duration);

        set_site_transient($this->identifier . '_process_lock', microtime(), $lock_duration);
    }

    /**
     * Unlock process.
     *
     * Unlock the process so that other instances can spawn.
     *
     * @return $this
     */
    protected function unlockProcess()
    {
        delete_site_transient($this->identifier . '_process_lock');

        return $this;
    }

    /**
     * Get batch.
     *
     * @return stdClass Return the first batch of queued items.
     */
    protected function getBatch()
    {
        return array_reduce(
            $this->getBatches(1),
            function ($carry, $batch) {
                return $batch;
            },
            []
        );
    }

    /**
     * Handle a dispatched request.
     *
     * Pass each queue item to the task handler, while remaining
     * within server memory and time limit constraints.
     */
    protected function handle()
    {
        $this->lock_process();
        do {
            $this->processNode();
        } while (!$this->timeExceeded() && !$this->memoryExceeded() && !$this->isQueueEmpty());

        $this->unlockProcess();

        // Start next batch or complete process.
        if (!$this->isQueueEmpty()) {
            $this->dispatch();
        } else {
            $this->complete();
        }

        return $this->maybeWpDie();
    }

    /**
     * Memory exceeded?
     *
     * Ensures the batch process never exceeds 90%
     * of the maximum WordPress memory.
     *
     * @return bool
     */
    protected function memoryExceeded()
    {
        $memory_limit = $this->getMemoryLimit() * 0.9; // 90% of max memory
        $current_memory = memory_get_usage(true);
        $return = false;

        if ($current_memory >= $memory_limit) {
            $return = true;
        }

        return apply_filters($this->identifier . '_memory_exceeded', $return);
    }

    /**
     * Get memory limit in bytes.
     *
     * @return int
     */
    protected function getMemoryLimit()
    {
        if (\function_exists('ini_get')) {
            $memory_limit = \ini_get('memory_limit');
        } else {
            // Sensible default.
            $memory_limit = '512M';
        }

        if (!$memory_limit || \intval($memory_limit) === -1) {
            // Unlimited, set to 32GB.
            $memory_limit = '32000M';
        }

        return wp_convert_hr_to_bytes($memory_limit);
    }

    /**
     * Time limit exceeded?
     *
     * Ensures the batch never exceeds a sensible time limit.
     * A timeout limit of 30s is common on shared hosting.
     *
     * @return bool
     */
    protected function timeExceeded()
    {
        $finish = $this->startTime + apply_filters($this->identifier . '_default_time_limit', 20); // 20 seconds
        $return = false;

        if (time() >= $finish) {
            $return = true;
        }

        return apply_filters($this->identifier . '_time_exceeded', $return);
    }

    /**
     * Complete processing.
     *
     * Override if applicable, but ensure that the below actions are
     * performed, or, call parent::complete().
     */
    protected function complete()
    {
        delete_site_option($this->getStatusKey());

        // Remove the cron healthcheck job from the cron schedule.
        $this->clearScheduledEvent();

        $this->completed();
    }

    /**
     * Called when background process has completed.
     */
    protected function completed()
    {
        do_action($this->identifier . '_completed');
    }

    /**
     * Schedule the cron healthcheck event.
     */
    protected function scheduleEvent()
    {
        if (!wp_next_scheduled($this->cronHookIdentifier)) {
            wp_schedule_event(time(), $this->cronIntervalIdentifier, $this->cronHookIdentifier);
        }
    }

    /**
     * Clear scheduled cron healthcheck event.
     */
    protected function clearScheduledEvent()
    {
        $timestamp = wp_next_scheduled($this->cronHookIdentifier);

        if ($timestamp) {
            wp_unschedule_event($timestamp, $this->cronHookIdentifier);
        }
    }

    /**
     * Perform task with queued item.
     *
     * Override this method to perform any actions required on each
     * queue item. Return the modified item for further processing
     * in the next pass through. Or, return false to remove the
     * item from the queue.
     *
     * @return mixed
     */
    abstract protected function task();

    abstract protected function handleTaskTimeout();

    protected function getFlowId()
    {
        return $this->flowId;
    }

    protected function getFlowHistoryId()
    {
        return $this->flowHistoryId;
    }

    protected function getCurrentNode()
    {
        return $this->currentNode;
    }

    protected function getExecutedNodeIds()
    {
        return $this->executedIds;
    }

    protected function getTriggerData()
    {
        return $this->triggerData;
    }

    protected function getListenerType()
    {
        return $this->listenerType;
    }

    private function processNode()
    {
        $batch = $this->getBatch();
        $tasks = $batch->data['tasks'];

        if (is_countable($tasks)) {
            $processingQueue = $tasks;
        } else {
            $processingQueue[] = $tasks;
        }

        $this->flowId = $batch->data['flow_id'];
        $this->flowHistoryId = $batch->data['flow_history_id'];
        $this->executedIds = $batch->data['executedIds'];
        $this->listenerType = $batch->data['listener_type'];

        while (\count($processingQueue) > 0) {
            $currentNode = array_shift($processingQueue);
            $this->currentNode = $currentNode;

            if ($currentNode->type === 'trigger') {
                $this->triggerData = $batch->data['trigger_data'];
                unset($batch->data['trigger_data']);
            }

            $isSkipNextNodes = $this->task();

            if ($isSkipNextNodes === true) {
                if (!isset($currentNode->next)) {
                    $batch->data = [];
                }

                if (!empty($processingQueue)) {
                    $batch->data['tasks'] = $processingQueue;
                } else {
                    $batch->data = [];
                    $this->update($batch->key, $batch->data);
                }

                continue;
            }

            if (isset($currentNode->next)) {
                if (\in_array($currentNode->type, ['router', 'condition'])) {
                    foreach ($currentNode->next as $childNode) {
                        $processingQueue[] = $childNode;
                    }
                } else {
                    $processingQueue[] = $currentNode->next;
                }

                $batch->data['tasks'] = $processingQueue;
            } elseif (!empty($processingQueue)) {
                $batch->data['tasks'] = $processingQueue;
            } else {
                $batch->data = [];
            }

            if (!empty($batch->data)) {
                $this->update($batch->key, $batch->data);
            }

            usleep(25000);

            if ($this->timeExceeded() || $this->memoryExceeded()) {
                $this->handleTaskTimeout();

                break;
            }
        }

        if (empty($batch->data)) {
            $this->delete($batch->key);
        }
    }
}
