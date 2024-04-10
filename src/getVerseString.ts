import { useCallback, useMemo } from 'react';
import papi from '@papi/frontend';
import { usePromise } from 'platform-bible-react';
import { useProjectData, useSetting } from '@papi/frontend/react';
import { VerseRef } from '@sillsdev/scripture';
import { ScriptureReference } from 'platform-bible-react';

const defaultScrRef: ScriptureReference = { bookNum: 1, chapterNum: 1, verseNum: 1 };

/**
 * Strips USFM markers out and such to transform USFM into plain text
 *
 * WARNING: This is not guaranteed to work perfectly. It's just a quick estimation for demonstration
 *
 * @param usfm USFM string
 * @returns Plain text string
 */
function stripUSFM(usfm: string) {
  return usfm
    .replace(/\\x .*\\x\*/g, '')
    .replace(/\\fig .*\\fig\*/g, '')
    .replace(/\\f .*\\f\*/g, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\\p\s+/g, '\n  ')
    .replace(/\\(?:id|h|toc\d|mt\d|c|ms\d|mr|s\d|q\d*)\s+/g, '\n')
    .replace(/\\\S+\s+/g, '')
    .trim();
}

export const getVerseString = () => {
  // Get the first project ID we can find
  const [ projectId ] = usePromise(
    useCallback(async () => {
      const metadata = await papi.projectLookup.getMetadataForAllProjects();
      const projectMeta = metadata.find((projectMetadata) => {
        projectMetadata.projectType === 'ParatextStandard';
      });
      return projectMeta?.id;
    }, []),
    undefined,
  );

  // Get current verse reference
  const [scrRef] = useSetting('platform.verseRef', defaultScrRef);

  // Transform ScriptureReference to VerseRef for project data
  const verseRef = useMemo(
    () => new VerseRef(scrRef.bookNum, scrRef.chapterNum, scrRef.verseNum, undefined),
    [scrRef],
  );

  const [verse] = useProjectData('ParatextStandard', projectId).VerseUSFM(verseRef, '');
  return verse ? stripUSFM(verse) : ""
}


