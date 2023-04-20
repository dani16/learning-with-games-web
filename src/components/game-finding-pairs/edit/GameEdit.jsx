import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { updateGame } from '../../../lib/api/game-finding-pairs';
import Button from '../../buttons/Button';
import InputText from '../../forms/InputText';
import GameEditActions from '../../games/GameEditActions';

import { useContext } from 'react';
import { FINDING_PAIRS_MODES } from '../../../constants/findingPairsModes';
import { AuthContext } from '../../../lib/context/AuthContext';
import InputSelect from '../../forms/InputSelect';
import styles from './GameEdit.module.css';
import PairCardEdit from './PairCardEdit';

const GameEdit = ({ game }) => {
	const { accessToken } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors, isDirty, isSubmitting }
	} = useForm({
		defaultValues: { title: game?.title, mode: game?.mode, pairs: game?.pairs }
	});

	const { fields, prepend, remove } = useFieldArray({
		name: 'pairs',
		control
	});

	const handleAddPairClick = () => {
		prepend({ text: '', image: '' });
	};

	return (
		<FormProvider
			register={register}
			watch={watch}
			errors={errors}
			remove={remove}
		>
			<section className={styles.container}>
				<GameEditActions
					gameId={game.id}
					isDirty={isDirty}
					isSubmitting={isSubmitting}
					clearForm={reset}
				/>

				<form
					id='form'
					className={styles.form}
					onSubmit={handleSubmit(async data => {
						await handleSubmitForm({
							accessToken,
							id: game.id,
							data,
							reset
						});
					})}
				>
					<div className={styles.game__info}>
						<div className={styles.form__fields}>
							<div className={styles.form__field}>
								<InputText
									name='title'
									label='Title'
									placeholder='Title'
									register={register}
									validate={{
										required: 'Field required',
										minLength: {
											value: 4,
											message: 'At least 4 characters'
										}
									}}
									error={errors.title?.message}
								/>
							</div>
							<div className={styles.form__field}>
								<InputSelect
									name='mode'
									label='Mode'
									register={register}
									error={errors.mode?.message}
								>
									<option value=''>Select mode...</option>
									{Object.values(FINDING_PAIRS_MODES).map(item => {
										return (
											<option key={item.type} value={item.type}>
												{item.name}
											</option>
										);
									})}
								</InputSelect>
							</div>
						</div>
					</div>

					<div className={styles.pairs}>
						<div className={styles.pairs__add}>
							<div className={styles.actions}>
								<Button type='button' onClick={handleAddPairClick}>
									Add pair
								</Button>
							</div>
						</div>
						<div className={styles.pairs__list}>
							{fields.map((field, index) => (
								<PairCardEdit key={field.id} index={index} control={control} />
							))}
						</div>
					</div>
				</form>
			</section>
		</FormProvider>
	);
};

const handleSubmitForm = async ({ accessToken, id, data, reset }) => {
	const success = await updateGame({
		accessToken,
		id,
		game: { ...data, type: 'finding-pairs' }
	});

	if (success) {
		reset({ ...data });
	}
};

export default GameEdit;
