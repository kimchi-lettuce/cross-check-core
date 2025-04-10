<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SearchableSelect, { type SelectOption } from '@/components/SearchableSelect.vue'
import { Input } from '@/components/ui/input'

export interface VerseSelection {
	book?: SelectOption<BibleBook>
	chapter?: number
	verse?: number
}

interface BibleBook {
	testament: 'old' | 'new'
	chapters: number
	title: string
}

const BOOKS_OF_BIBLE = [
	{
		key: 'genesis',
		label: 'Genesis',
		value: { testament: 'old', chapters: 50, title: 'Genesis' }
	},
	{
		key: 'exodus',
		label: 'Exodus',
		value: { testament: 'old', chapters: 40, title: 'Exodus' }
	},
	{
		key: 'leviticus',
		label: 'Leviticus',
		value: { testament: 'old', chapters: 27, title: 'Leviticus' }
	},
	{
		key: 'numbers',
		label: 'Numbers',
		value: { testament: 'old', chapters: 36, title: 'Numbers' }
	},
	{
		key: 'deuteronomy',
		label: 'Deuteronomy',
		value: { testament: 'old', chapters: 34, title: 'Deuteronomy' }
	},
	{
		key: 'joshua',
		label: 'Joshua',
		value: { testament: 'old', chapters: 24, title: 'Joshua' }
	},
	{
		key: 'judges',
		label: 'Judges',
		value: { testament: 'old', chapters: 21, title: 'Judges' }
	},
	{
		key: 'ruth',
		label: 'Ruth',
		value: { testament: 'old', chapters: 4, title: 'Ruth' }
	},
	{
		key: '1samuel',
		label: '1 Samuel',
		value: { testament: 'old', chapters: 31, title: '1 Samuel' }
	},
	{
		key: '2samuel',
		label: '2 Samuel',
		value: { testament: 'old', chapters: 24, title: '2 Samuel' }
	},
	{
		key: '1kings',
		label: '1 Kings',
		value: { testament: 'old', chapters: 22, title: '1 Kings' }
	},
	{
		key: '2kings',
		label: '2 Kings',
		value: { testament: 'old', chapters: 25, title: '2 Kings' }
	},
	{
		key: '1chronicles',
		label: '1 Chronicles',
		value: { testament: 'old', chapters: 29, title: '1 Chronicles' }
	},
	{
		key: '2chronicles',
		label: '2 Chronicles',
		value: { testament: 'old', chapters: 36, title: '2 Chronicles' }
	},
	{
		key: 'ezra',
		label: 'Ezra',
		value: { testament: 'old', chapters: 10, title: 'Ezra' }
	},
	{
		key: 'nehemiah',
		label: 'Nehemiah',
		value: { testament: 'old', chapters: 13, title: 'Nehemiah' }
	},
	{
		key: 'esther',
		label: 'Esther',
		value: { testament: 'old', chapters: 10, title: 'Esther' }
	},
	{
		key: 'job',
		label: 'Job',
		value: { testament: 'old', chapters: 42, title: 'Job' }
	},
	{
		key: 'psalms',
		label: 'Psalms',
		value: { testament: 'old', chapters: 150, title: 'Psalms' }
	},
	{
		key: 'proverbs',
		label: 'Proverbs',
		value: { testament: 'old', chapters: 31, title: 'Proverbs' }
	},
	{
		key: 'ecclesiastes',
		label: 'Ecclesiastes',
		value: { testament: 'old', chapters: 12, title: 'Ecclesiastes' }
	},
	{
		key: 'songofsolomon',
		label: 'Song of Solomon',
		value: { testament: 'old', chapters: 8, title: 'Song of Solomon' }
	},
	{
		key: 'isaiah',
		label: 'Isaiah',
		value: { testament: 'old', chapters: 66, title: 'Isaiah' }
	},
	{
		key: 'jeremiah',
		label: 'Jeremiah',
		value: { testament: 'old', chapters: 52, title: 'Jeremiah' }
	},
	{
		key: 'lamentations',
		label: 'Lamentations',
		value: { testament: 'old', chapters: 5, title: 'Lamentations' }
	},
	{
		key: 'ezekiel',
		label: 'Ezekiel',
		value: { testament: 'old', chapters: 48, title: 'Ezekiel' }
	},
	{
		key: 'daniel',
		label: 'Daniel',
		value: { testament: 'old', chapters: 12, title: 'Daniel' }
	},
	{
		key: 'hosea',
		label: 'Hosea',
		value: { testament: 'old', chapters: 14, title: 'Hosea' }
	},
	{
		key: 'joel',
		label: 'Joel',
		value: { testament: 'old', chapters: 3, title: 'Joel' }
	},
	{
		key: 'amos',
		label: 'Amos',
		value: { testament: 'old', chapters: 9, title: 'Amos' }
	},
	{
		key: 'obadiah',
		label: 'Obadiah',
		value: { testament: 'old', chapters: 1, title: 'Obadiah' }
	},
	{
		key: 'jonah',
		label: 'Jonah',
		value: { testament: 'old', chapters: 4, title: 'Jonah' }
	},
	{
		key: 'micah',
		label: 'Micah',
		value: { testament: 'old', chapters: 7, title: 'Micah' }
	},
	{
		key: 'nahum',
		label: 'Nahum',
		value: { testament: 'old', chapters: 3, title: 'Nahum' }
	},
	{
		key: 'habakkuk',
		label: 'Habakkuk',
		value: { testament: 'old', chapters: 3, title: 'Habakkuk' }
	},
	{
		key: 'zephaniah',
		label: 'Zephaniah',
		value: { testament: 'old', chapters: 3, title: 'Zephaniah' }
	},
	{
		key: 'haggai',
		label: 'Haggai',
		value: { testament: 'old', chapters: 2, title: 'Haggai' }
	},
	{
		key: 'zechariah',
		label: 'Zechariah',
		value: { testament: 'old', chapters: 14, title: 'Zechariah' }
	},
	{
		key: 'malachi',
		label: 'Malachi',
		value: { testament: 'old', chapters: 4, title: 'Malachi' }
	},
	{
		key: 'matthew',
		label: 'Matthew',
		value: { testament: 'new', chapters: 28, title: 'Matthew' }
	},
	{
		key: 'mark',
		label: 'Mark',
		value: { testament: 'new', chapters: 16, title: 'Mark' }
	},
	{
		key: 'luke',
		label: 'Luke',
		value: { testament: 'new', chapters: 24, title: 'Luke' }
	},
	{
		key: 'john',
		label: 'John',
		value: { testament: 'new', chapters: 21, title: 'John' }
	},
	{
		key: 'acts',
		label: 'Acts',
		value: { testament: 'new', chapters: 28, title: 'Acts' }
	},
	{
		key: 'romans',
		label: 'Romans',
		value: { testament: 'new', chapters: 16, title: 'Romans' }
	},
	{
		key: '1corinthians',
		label: '1 Corinthians',
		value: { testament: 'new', chapters: 16, title: '1 Corinthians' }
	},
	{
		key: '2corinthians',
		label: '2 Corinthians',
		value: { testament: 'new', chapters: 13, title: '2 Corinthians' }
	},
	{
		key: 'galatians',
		label: 'Galatians',
		value: { testament: 'new', chapters: 6, title: 'Galatians' }
	},
	{
		key: 'ephesians',
		label: 'Ephesians',
		value: { testament: 'new', chapters: 6, title: 'Ephesians' }
	},
	{
		key: 'philippians',
		label: 'Philippians',
		value: { testament: 'new', chapters: 4, title: 'Philippians' }
	},
	{
		key: 'colossians',
		label: 'Colossians',
		value: { testament: 'new', chapters: 4, title: 'Colossians' }
	},
	{
		key: '1thessalonians',
		label: '1 Thessalonians',
		value: { testament: 'new', chapters: 5, title: '1 Thessalonians' }
	},
	{
		key: '2thessalonians',
		label: '2 Thessalonians',
		value: { testament: 'new', chapters: 3, title: '2 Thessalonians' }
	},
	{
		key: '1timothy',
		label: '1 Timothy',
		value: { testament: 'new', chapters: 6, title: '1 Timothy' }
	},
	{
		key: '2timothy',
		label: '2 Timothy',
		value: { testament: 'new', chapters: 4, title: '2 Timothy' }
	},
	{
		key: 'titus',
		label: 'Titus',
		value: { testament: 'new', chapters: 3, title: 'Titus' }
	},
	{
		key: 'philemon',
		label: 'Philemon',
		value: { testament: 'new', chapters: 1, title: 'Philemon' }
	},
	{
		key: 'hebrews',
		label: 'Hebrews',
		value: { testament: 'new', chapters: 13, title: 'Hebrews' }
	},
	{
		key: 'james',
		label: 'James',
		value: { testament: 'new', chapters: 5, title: 'James' }
	},
	{
		key: '1peter',
		label: '1 Peter',
		value: { testament: 'new', chapters: 5, title: '1 Peter' }
	},
	{
		key: '2peter',
		label: '2 Peter',
		value: { testament: 'new', chapters: 3, title: '2 Peter' }
	},
	{
		key: '1john',
		label: '1 John',
		value: { testament: 'new', chapters: 5, title: '1 John' }
	},
	{
		key: '2john',
		label: '2 John',
		value: { testament: 'new', chapters: 1, title: '2 John' }
	},
	{
		key: '3john',
		label: '3 John',
		value: { testament: 'new', chapters: 1, title: '3 John' }
	},
	{
		key: 'jude',
		label: 'Jude',
		value: { testament: 'new', chapters: 1, title: 'Jude' }
	},
	{
		key: 'revelation',
		label: 'Revelation',
		value: { testament: 'new', chapters: 22, title: 'Revelation' }
	}
]

const model = defineModel<VerseSelection>({
	default: () => ({})
})

const selectedBook = computed({
	get: () => model.value.book,
	set: book => {
		model.value = {
			book,
			chapter: undefined,
			verse: undefined
		}
	}
})

const chapter = computed({
	get: () => model.value.chapter,
	set: newChapter => {
		model.value = {
			...model.value,
			chapter: Number(newChapter),
			verse: undefined
		}
	}
})

const verse = computed({
	get: () => model.value.verse,
	set: newVerse => {
		model.value = {
			...model.value,
			verse: Number(newVerse)
		}
	}
})

// Reset chapter and verse when book changes
watch(
	selectedBook,
	() => {
		chapter.value = undefined
		verse.value = undefined
	},
	{ deep: true }
)

// Reset verse when chapter changes
watch(chapter, () => (verse.value = undefined))
</script>

<template>
	<div class="flex items-center gap-2">
		<SearchableSelect v-model="selectedBook" :options="BOOKS_OF_BIBLE" placeholder="Select a book..." empty-message="No books found" />

		<Input type="number" v-model="chapter" placeholder="Chapter" class="w-20 h-9" />
		<span class="text-muted-foreground">:</span>
		<Input type="number" v-model="verse" placeholder="Verse" class="w-20 h-9" />
	</div>
</template>
