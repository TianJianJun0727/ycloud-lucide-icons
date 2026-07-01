<script setup lang="ts">
import type { IconEntity } from '@theme/types';
import { computed } from 'vue';
import { createYCloudIcon } from '@ycloud-web/icons-vue';
import Calendar from '@data/iconDetails/calendar.ts';
import Clock from '@data/iconDetails/clock.ts';
import Bug from '@data/iconDetails/bug.ts';
import Rocket from '@data/iconDetails/rocket.ts';
import TriangleAlert from '@data/iconDetails/triangle-alert.ts';
import PartyPopper from '@data/iconDetails/party-popper.ts';
import Scissors from '@data/iconDetails/scissors.ts';
import Copy from '@data/iconDetails/copy.ts';
import Save from '@data/iconDetails/save.ts';
import Clipboard from '@data/iconDetails/clipboard.ts';
import MessageCircle from '@data/iconDetails/message-circle.ts';
import ThumbsDown from '@data/iconDetails/thumbs-down.ts';
import ThumbsUp from '@data/iconDetails/thumbs-up.ts';
import Heart from '@data/iconDetails/heart.ts';
import Folder from '@data/iconDetails/folder.ts';
import Files from '@data/iconDetails/files.ts';
import Plus from '@data/iconDetails/plus.ts';
import File from '@data/iconDetails/file.ts';
import FileText from '@data/iconDetails/file-text.ts';
import { localizeIconName } from '@theme/utils/iconI18n';
import { useData } from 'vitepress';

const props = defineProps<{
  name: IconEntity['name'];
  displayName?: IconEntity['displayName'];
  englishName?: IconEntity['englishName'];
  iconNode: IconEntity['iconNode'];
}>();

const iconComponent = computed(() => {
  if (!props.name || !props.iconNode) return null;
  try {
    return createYCloudIcon(props.name, props.iconNode);
  } catch (error) {
    console.warn(`Icon ${props.name} not found, using fallback`);
    return null;
  }
});

const CalendarIcon = createYCloudIcon('calendar', Calendar.iconNode);
const ClockIcon = createYCloudIcon('clock', Clock.iconNode);
const BugIcon = createYCloudIcon('bug', Bug.iconNode);
const RocketIcon = createYCloudIcon('rocket', Rocket.iconNode);
const AlertTriangleIcon = createYCloudIcon('alert-triangle', TriangleAlert.iconNode);
const ScissorsIcon = createYCloudIcon('scissors', Scissors.iconNode);
const CopyIcon = createYCloudIcon('copy', Copy.iconNode);
const SaveIcon = createYCloudIcon('save', Save.iconNode);
const ClipboardIcon = createYCloudIcon('clipboard', Clipboard.iconNode);
const PartyPopperIcon = createYCloudIcon('party-popper', PartyPopper.iconNode);
const HeartIcon = createYCloudIcon('heart', Heart.iconNode);
const ThumbsUpIcon = createYCloudIcon('thumbs-up', ThumbsUp.iconNode);
const ThumbsDownIcon = createYCloudIcon('thumbs-down', ThumbsDown.iconNode);
const MessageCircleIcon = createYCloudIcon('message-circle', MessageCircle.iconNode);
const FolderIcon = createYCloudIcon('folder.ts', Folder.iconNode);
const FilesIcon = createYCloudIcon('files.ts', Files.iconNode);
const PlusIcon = createYCloudIcon('plus.ts', Plus.iconNode);
const FileIcon = createYCloudIcon('file.ts', File.iconNode);
const FileTextIcon = createYCloudIcon('file-text.ts', FileText.iconNode);

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const prettyName = computed(() =>
  isEnglish.value ? props.englishName ?? props.name : localizeIconName(props.name, props.displayName),
);
</script>

<template>
  <section
    class="showcase"
    v-if="iconComponent"
  >
    <h2 class="title">{{ isEnglish ? 'Icon usage examples' : '图标使用示例' }}</h2>
    <div class="showcase-grid">
      <div class="showcase-item column">
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder narrow"></div>
        <div class="spacer"></div>
        <div class="actions">
          <button class="button button-brand">
            <iconComponent />
            {{ prettyName }}
          </button>
          <button class="button button-alt">{{ isEnglish ? 'Cancel' : '取消' }}</button>
        </div>
      </div>
      <div class="showcase-item column">
        <div class="placeholder narrow"></div>
        <div class="input-wrapper">
          <CalendarIcon v-if="name !== 'calendar'" />
          <ClockIcon v-if="name == 'calendar'" />
          <input
            type="text"
            v-if="name !== 'calendar'"
            :placeholder="isEnglish ? 'Enter date...' : '输入日期...'"
          />
          <input
            type="text"
            v-if="name == 'calendar'"
            :placeholder="isEnglish ? 'Enter time...' : '输入时间...'"
          />
        </div>
        <div class="spacer"></div>
        <div class="placeholder narrow"></div>
        <div class="input-wrapper">
          <iconComponent />
          <input
            type="text"
            :placeholder="isEnglish ? 'Enter text...' : '输入内容...'"
          />
        </div>
      </div>
      <div class="showcase-item column">
        <div
          class="row"
          v-if="name !== 'bug'"
        >
          <div class="placeholder"></div>
          <div class="badge badge-red">
            <BugIcon :size="20" />
            {{ isEnglish ? 'Bug' : '缺陷' }}
          </div>
        </div>
        <div
          class="row"
          v-else
        >
          <div class="placeholder"></div>
          <div class="badge badge-red">
            <AlertTriangleIcon :size="20" />
            {{ isEnglish ? 'Alert' : '告警' }}
          </div>
        </div>
        <div class="row">
          <div class="placeholder"></div>
          <div class="badge badge-indigo">
            <RocketIcon
              :size="20"
              v-if="name !== 'rocket'"
            />
            <PartyPopperIcon
              :size="20"
              v-else
            />
            {{ isEnglish ? 'Feature' : '功能' }}
          </div>
        </div>
        <div class="row">
          <div class="placeholder"></div>
          <div class="badge badge-green">
            <iconComponent :size="20" />
            {{ prettyName }}
          </div>
        </div>
      </div>
      <div class="showcase-item column">
        <button class="button button-alt button-square">
          <FolderIcon v-if="name !== 'folder'" />
          <FilesIcon v-else />
          {{ isEnglish ? 'Docs' : '文档' }}
          <PlusIcon class="ms-auto" />
        </button>
        <button class="button button-alt button-square">
          <FileIcon v-if="name !== 'file'" />
          <FileTextIcon v-else />
          {{ isEnglish ? 'Readme' : '自述文件' }}
        </button>
        <button class="button button-alt button-square">
          <iconComponent />
          {{ prettyName }}
          <span class="badge-notification ms-auto">12</span>
        </button>
      </div>
      <div class="showcase-item column">
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder"></div>
        <div class="placeholder narrow"></div>
        <div class="spacer"></div>
        <div class="actions">
          <div class="icon-counter">
            <HeartIcon v-if="name !== 'heart'" />
            <ThumbsUpIcon v-else />
            112
          </div>
          <div class="spacer"></div>
          <div class="icon-counter">
            <MessageCircleIcon v-if="name !== 'message-circle'" />
            <ThumbsDownIcon v-else />
            8
          </div>
          <div class="spacer"></div>
          <div class="icon-counter">
            <iconComponent />
            11
          </div>
        </div>
      </div>
      <div class="showcase-item">
        <div class="column align-items-center">
          <div class="actions justify-content-center">
            <button class="button button-icon">
              <CopyIcon v-if="name !== 'copy'" />
              <SaveIcon v-else />
            </button>
            <button class="button button-icon">
              <ScissorsIcon v-if="name !== 'scissors'" />
              <SaveIcon v-else />
            </button>
            <button class="button button-icon">
              <ClipboardIcon v-if="name !== 'clipboard'" />
              <SaveIcon v-else />
            </button>
            <button class="button button-icon">
              <iconComponent></iconComponent>
              <span class="badge-notification">2</span>
            </button>
          </div>
          <div class="spacer"></div>
          <div class="placeholder"></div>
          <div class="placeholder"></div>
          <div class="placeholder"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  margin-bottom: 32px;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 48px;
  margin-inline-start: 24px;
  margin-block-start: 48px;
}

.showcase-item {
  padding: 24px;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow:
    var(--vp-shadow-4),
    -24px -24px 0 var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
}

.spacer {
  flex-basis: 0;
}

.button {
  position: relative;
  border-radius: 32px;
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  font-weight: 500;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;

  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  &:hover {
    border-color: var(--vp-button-alt-hover-border);
    color: var(--vp-button-alt-hover-text);
    background-color: var(--vp-button-alt-hover-bg);
  }
  &.button-brand {
    border-color: var(--vp-button-brand-border);
    color: var(--vp-button-brand-text);
    background-color: var(--vp-button-brand-bg);
    &:hover {
      border-color: var(--vp-button-brand-hover-border);
      color: var(--vp-button-brand-hover-text);
      background-color: var(--vp-button-brand-hover-bg);
    }
  }
  &.button-icon {
    padding: 12px;
  }
  &.button-square {
    border-radius: 8px;
    width: 100%;
  }
}

.actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
}

.ycloud {
  flex-shrink: 0;
  flex-grow: 0;
}

.placeholder {
  display: block;
  background-color: var(--vp-c-bg-soft);
  border-radius: 32px;
  height: 16px;
  width: 100%;

  &.narrow {
    width: 33%;
  }
}

.input-wrapper {
  position: relative;
  width: 100%;
  .ycloud {
    position: absolute;
    inset-inline-start: 12px;
    inset-block: 50%;
    translate: 0 -50%;
    color: var(--vp-c-text-1);
    opacity: 0.7;
  }
  input {
    padding: 12px 20px;
    padding-inline-start: 48px;
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    display: block;
    width: 100%;
    border: 2px solid transparent;
    transition:
      color 0.25s,
      border-color 0.25s,
      background-color 0.25s;
    &:hover {
      border-color: var(--vp-c-border);
    }
    &:focus {
      border-color: var(--vp-c-brand);
    }
  }
  &:focus-within {
    .ycloud {
      opacity: 1;
    }
  }
}

.badge {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: transparent;
  overflow: hidden;
  position: relative;
  color: var(--badge-color);
  &:before {
    content: ' ';
    inset: 0;
    position: absolute;
    background-color: var(--badge-color);
    opacity: 0.1;
  }
  &.badge-indigo {
    --badge-color: var(--vp-c-indigo-2);
  }
  &.badge-green {
    --badge-color: var(--vp-c-green-2);
  }
  &.badge-red {
    --badge-color: var(--vp-c-brand);
  }
}

.badge-notification {
  background-color: var(--vp-c-brand);
  color: var(--vp-button-brand-text);
  border-radius: 32px;
  padding: 0 8px;
  min-width: 24px;
  min-height: 24px;
}

.button-icon {
  .badge-notification {
    position: absolute;
    top: 0;
    right: 0;
    translate: 33% -33%;
  }
}

.row {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.icon-counter {
  display: flex;
  flex-direction: row;
  gap: 6px;
  color: var(--vp-c-text-2);
  align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  width: 100%;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.ms-auto {
  margin-inline-start: auto;
}
</style>
